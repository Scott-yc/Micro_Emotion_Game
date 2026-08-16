<?php

namespace app\admin\model\bullet;

use think\Model;


class Hurt extends Model
{


	// 表名
	protected $name = 'bullet_upgrade';

	// 自动写入时间戳字段
	protected $autoWriteTimestamp = 'integer';

	// 定义时间戳字段名
	protected $createTime = 'createtime';
	protected $updateTime = 'updatetime';
	protected $deleteTime = false;

	// 追加属性
	protected $append = [
		'type_text'
	];

	protected static function init()
	{
		self::afterInsert(function ($row) {
			$level = self::where('type', 1)->max('level');
			$row->save(['level' => $level + 1]);
		});
	}

	public function getTypeTextAttr($value, $data)
	{
		$value = $value ?: ($data['type'] ?? '');
		$list = $this->getTypeList();
		return $list[$value] ?? '';
	}

	public function getTypeList()
	{
		return ['1' => __('Type 1'), '2' => __('Type 2')];
	}


}
