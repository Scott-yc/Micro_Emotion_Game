<?php

namespace app\common\model;

use think\Model;

/**
 * 会员余额日志模型
 */
class BarrierRecord extends Model
{
    // 开启自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
	public function user()
	{
		return $this->belongsTo('app\common\model\User', 'uid')->setEagerlyType(0);
	}
	public function skin()
	{
		return $this->belongsTo('app\admin\model\Skin', 'skin_id')->setEagerlyType(0);
	}
}
