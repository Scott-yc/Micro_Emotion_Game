<?php
namespace app\api\validate;
use think\Validate;
class Barrier extends Validate
{
    protected $rule = [
        'id|闯关记录ID' => 'require|integer',
        'strange_num|击杀小怪数量' => 'require|integer',
        'type|类型' => 'require|in:1,2',
        'boos_num|boos数量' => 'require|integer',
        'hurt|伤害' => 'require|integer',
    ];
    /**
     * 验证场景
     */
    protected $scene = [
        'settle' => ['id','strange_num','type','boos_num','hurt'],
    ];
}