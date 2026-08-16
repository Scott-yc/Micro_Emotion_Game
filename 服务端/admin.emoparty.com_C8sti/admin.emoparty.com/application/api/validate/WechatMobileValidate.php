<?php

namespace app\api\validate;

use think\Validate;

class WechatMobileValidate extends Validate
{
    protected $rule = [
        'code|code'     => 'require',
        'nickname|昵称' => 'require',
        'avatar|头像'   => 'require',
    ];
    /**
     * 验证场景
     */
    protected $scene = [
        'login' => ['code', 'nickname', 'avatar'],
    ];
}