<?php

namespace app\api\controller;

use app\admin\model\bullet\Hurt;
use app\admin\model\Monster;
use app\admin\model\Skin;
use app\common\controller\Api;
use app\common\model\BarrierRecord;
use app\common\model\Config;
use app\common\model\MoneyLog;
use app\common\model\ScoreLog;
use app\common\model\SkinLog;
use think\Db;

/**
 * 手机短信接口
 */
class Barrier extends Api
{
	protected $noNeedLogin = ['shop'];
	protected $noNeedRight = '*';

	//已获得的皮肤
	public function skin()
	{
		$data['skin'] = explode(',', $this->auth->skin);
		//默认皮肤
		$data['default_skin'] = $this->auth->default_skin;
		$this->success('', $data);
	}

	//设置默认皮肤
	public function set_default_skin()
	{
		$id = $this->request->post('id');
		if (!in_array($id, explode(',', $this->auth->skin))) {
			$this->error('请先获取当前皮肤');
		}
		$user = $this->auth->getUser();
		$user->default_skin = $id;
		$user->save();
		$this->success('');
	}

	//开始闯关
	public function start()
	{
		$data = BarrierRecord::create([
			'uid'     => $this->auth->id,
			'skin_id' => $this->auth->default_skin,
		]);
		$this->success('', $data->id);
	}

	//升级子弹配置
	public function upgrade()
	{
		$type = $this->request->post('type');
		$id = $this->request->post('id');
		if (!$type) {
			$this->error('请选择升级类型');
		}
		$data = BarrierRecord::where('id', $id)->where('uid', $this->auth->id)->find();
		if (!$data) {
			$this->error('当前闯关记录不存在');
		}
		if ($type == 1) {
			$hurt = Hurt::where('level', $data['hurt_level'] + 1)->find();
		} else {
			$hurt = Hurt::where('level', $data['range_level'] + 1)->find();
		}
		if (!$hurt) {
			$this->error('当前已达到最高等级');
		}
//		if ($this->auth->score < $hurt->num) {
//			$this->error('当前积分余额不足');
//		}
		// 启动事务
		Db::startTrans();
		try {
//			if ($hurt->num > 0) {
//				$user = $this->auth->getUser();
//				$user->score(-$hurt->num, $this->auth->id, '升级扣除' . $hurt->num . '积分', 1);
//			}
			if ($type == 1) {
				$data->hurt_level = $data['hurt_level'] + 1;
			} else {
				$data->range_level = $data['range_level'] + 1;
			}
			$data->save();
			// 提交事务
			Db::commit();
		} catch (\Exception $e) {
			// 回滚事务
			Db::rollback();
			$this->error($e->getMessage());
		}
		$this->success('', $data);
	}

	//获取积分数量
	public function score()
	{
		$id = $this->request->post('id');
		$monster_id = $this->request->post('monster_id');
		$data = BarrierRecord::where('id', $id)->where('uid', $this->auth->id)->find();
		if (!$data) {
			$this->error('当前闯关记录不存在');
		}
		$monster = Monster::where('id', $monster_id)->find();
		if (!$monster) {
			$this->error('当前怪物不存在');
		}
		// 启动事务
		Db::startTrans();
		try {
			$user = $this->auth->getUser();
			$user->score($monster->money, $this->auth->id, '击杀怪物获得' . $monster->money . '积分', 4);
			//增加晶石
			$data->save();
			// 提交事务
			Db::commit();
		} catch (\Exception $e) {
			// 回滚事务
			Db::rollback();
			$this->error($e->getMessage());
		}
		$this->success('');
	}

	//闯关完成
	public function finish()
	{
		$id = $this->request->post('id');
		$day = $this->request->post('day');
		$data = BarrierRecord::where('id', $id)->where('uid', $this->auth->id)->find();
		if (!$data) {
			$this->error('当前闯关记录不存在');
		}
		if ($data['is_revive'] == 1 && $data['status'] == 1) {
			$this->error('当前关卡已完成');
		}
		$survival_spar = Config::where('name', 'survival_spar')->value('value');
		$survival_points = Config::where('name', 'survival_points')->value('value');
		$score = 0;
		$money = 0;
		if ($data['status'] == 0) {
			$score = $survival_points * $day;
			$money = $survival_spar * $day;
		}
		if ($data['is_revive'] == 0) {
			if ($day > $data->day) {
				$score = $survival_points * ($day - $data->day);
				$money = $survival_spar * ($day - $data->day);
			}
		}
		// 启动事务
		Db::startTrans();
		try {
			$user = $this->auth->getUser();
			if ($score > 0) {
				//增加积分
//				ScoreLog::create([
//					'user_id' => $this->auth->id,
//					'score'   => $score,
//					'type'    => 2,
//					'memo'    => '闯关获得' . $score . '积分',
//				]);
				$user->score($score, $this->auth->id, '闯关获得' . $score . '积分', 2);
			}
			if ($money > 0) {
				//增加晶石
//				MoneyLog::create([
//					'user_id' => $this->auth->id,
//					'money'   => $money,
//					'type'    => 1,
//					'memo'    => '闯关获得' . $money . '晶石',
//				]);
				$user->money($money, $this->auth->id, '闯关获得' . $money . '晶石', 1);
			}
			if ($data['status'] == 0) {
				$data->status = 1;
				$data->day = $day;
			}
			if ($data['is_revive'] == 0) {
				if ($day > $data->day) {
					$data->day = $day;
				}
				$data->is_revive = 1;
			}
			$data->score += $score;
			$data->money += $money;
			//增加晶石
			$data->save();
			// 提交事务
			Db::commit();
		} catch (\Exception $e) {
			// 回滚事务
			Db::rollback();
			$this->error($e->getMessage());
		}
		$this->success('', $data);
	}

	//商城列表
	public function shop()
	{
		$skin = Config::where('name', 'skin_id')->value('value');
		$skin = Skin::whereIn('id', $skin)->select();
		foreach ($skin as $item) {
			$item->image = "https://emote.xinzhiyukeji.cn/" . $item->image;
//			$item->image = cdnurl($item->image, true);
			//判断是否获得
			if (in_array($item->id, explode(',', $this->auth->skin))) {
				$item->obtain_type = 1;
			} else {
				$item->obtain_type = 0;
			}
			$item->visible(['id', 'name', 'image', 'access', 'number', 'obtain_type']);
		}
		$this->success('', $skin);
	}

	//兑换皮肤
	public function exchange()
	{
		$id = $this->request->post('id');
		$skin = Skin::where('id', $id)->find();
		if (!$skin) {
			$this->error('请选择兑换的皮肤');
		}
		if (in_array($id, explode(',', $this->auth->skin))) {
			$this->error('当前皮肤已获得');
		}
		if ($skin->access == 2) {
			if ($this->auth->money < $skin->number) {
				$this->error('当前晶石余额不足');
			}
		}
		// 启动事务
		Db::startTrans();
		try {
			if ($skin->access == 2) {
				$user = $this->auth->getUser();
				$user->money(-$skin->number, $this->auth->id, '兑换皮肤扣除' . $skin->number . '晶石', 2);
				//增加晶石
//				MoneyLog::create([
//					'user_id' => $this->auth->id,
//					'money'   => -$skin->number,
//					'type'    => 2,
//					'memo'    => '兑换皮肤扣除' . $skin->number . '晶石',
//				]);
			}
			SkinLog::create([
				'uid'     => $this->auth->id,
				'skin_id' => $id,
				'access'  => $skin->access,
			]);
			$user = $this->auth->getUser();
			$user->skin .= ',' . $id;
			$user->save();
			// 提交事务
			Db::commit();
		} catch (\Exception $e) {
			// 回滚事务
			Db::rollback();
			$this->error($e->getMessage());
		}
		$this->success('');
	}
}
