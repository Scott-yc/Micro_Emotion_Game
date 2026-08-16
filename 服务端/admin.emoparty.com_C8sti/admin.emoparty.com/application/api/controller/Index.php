<?php

namespace app\api\controller;

use app\admin\model\bullet\Hurt;
use app\admin\model\Monster;
use app\admin\model\elite\Monster as EliteMonster;
use app\admin\model\MonsterBoss;
use app\common\controller\Api;
use app\common\model\BarrierRecord;
use app\common\model\Config;
use app\common\server\WechatServer;
use EasyWeChat\Factory;

/**
 * 首页接口
 */
class Index extends Api
{
	protected $noNeedLogin = ['*'];
	protected $noNeedRight = ['*'];
	/**
	 * 模拟登录
	 * @return void
	 */
	public function mockLogin()
	{
		$user_id = $this->request->param('user_id');
		$login_result = $this->auth->direct($user_id);
		if (!$login_result) {
			$this->error('登录失败', null, 401);
		}
		$this->success('登录成功', $this->auth->getUserinfo());
	}
	/**
	 * 首页
	 *
	 */
	public function index()
	{
		$weekStart = strtotime(date('Y-m-d', strtotime('monday this week')));
		//获取本周闯关最高的天数
		$BarrierRecord = BarrierRecord::where('uid', 48)->where('status', 1)->where('day', '>', 0)->where('createtime', '>=', $weekStart)->order('day desc')->find();
		dump($weekStart);
		halt($BarrierRecord);
		$this->success('请求成功');
	}

	//配置信息
	public function bulletLevel()
	{
		$data = Config::where('group', 'parameter')->column('value', 'name');
		$data['hurt'] = Hurt::where('type', 1)->order('level asc')->field('num,hurt,level')->select();
		$data['monster'] = Monster::field('id,name,image,blood,money,moving_speed')->select();
		$data['elite_monster'] = EliteMonster::field('id,name,image,blood,money,moving_speed,minion_blood')->select();
		$data['monster_boss'] = MonsterBoss::field('id,name,image,blood,money,moving_speed')->select();
		$data['range'] = Hurt::where('type', 2)->order('level asc')->field('num,level')->select();
		$data['advertisement_obtain_points'] = Config::where('name', 'advertisement_obtain_points')->value('value');
		$data['survival_spar'] = Config::where('name', 'survival_spar')->value('value');
		$data['survival_points'] = Config::where('name', 'survival_points')->value('value');
		$data['revive_frequency'] = Config::where('name', 'revive_frequency')->value('value');
		$this->success('', $data);
	}

	//清除排行榜数据
	public function clearRank()
	{
		$config = WechatServer::getMnpConfig();
		$app = Factory::miniProgram($config);
		// 3. 调用 removeUserStorage 方法删除用户缓存
		$keys = ['score', 'tid'];                   // 要删除的缓存key列表
		$user = \app\common\model\User::where('id','>',0)->field('openid,session_key')->select();
		foreach ($user as $item) {
			$openid = $item->openid;           // 替换为实际用户OpenID
			if ($openid && $item->session_key) {
				$result = $app->open_data->removeUserStorage($openid, $item->session_key, $keys);
			}
		}
		$this->success('');
	}
}
