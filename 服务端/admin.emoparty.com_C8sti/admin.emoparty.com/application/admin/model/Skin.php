<?php

namespace app\admin\model;

use think\Model;


class Skin extends Model
{

    

    

    // 表名
    protected $name = 'skin';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'integer';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = false;

    // 追加属性
    protected $append = [
        'access_text'
    ];
    

    
    public function getAccessList()
    {
        return ['1' => __('Access 1'), '2' => __('Access 2')];
    }


    public function getAccessTextAttr($value, $data)
    {
        $value = $value ?: ($data['access'] ?? '');
        $list = $this->getAccessList();
        return $list[$value] ?? '';
    }




}
