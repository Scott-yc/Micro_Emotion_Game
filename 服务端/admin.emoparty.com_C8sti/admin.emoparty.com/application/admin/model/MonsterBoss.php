<?php

namespace app\admin\model;

use think\Model;


class MonsterBoss extends Model
{

    

    

    // 表名
    protected $name = 'monster_boss';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'integer';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = false;

    // 追加属性
    protected $append = [

    ];
    

    







}
