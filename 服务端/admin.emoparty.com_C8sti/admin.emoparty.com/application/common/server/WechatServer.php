<?php
namespace app\common\server;
use app\common\model\Config;

/**
 * 微信接口公共服务类
 */
class WechatServer
{
    /**
     * 微信配置
     * @var [type]
     */
    protected $config;
    /**
     * 获取微信小程序配置
     */
    public static function getMnpConfig()
    {
        $config = [
            'app_id' => Config::getValue('app_id'),
            'secret' => Config::getValue('app_secret'),
            'response_type' => 'array',
            'log' => [
                'level' => 'debug',
                'file' => '../runtime/log/wechat.log'
            ],
        ];
        return $config;
    }


}