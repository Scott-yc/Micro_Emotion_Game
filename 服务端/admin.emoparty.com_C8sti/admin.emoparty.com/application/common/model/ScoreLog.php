<?php

namespace app\common\model;

use app\admin\model\User;
use think\Exception;
use think\Model;

/**
 * 会员积分日志模型
 */
class ScoreLog extends Model
{

    // 表名
    protected $name = 'user_score_log';
    // 开启自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = '';
    // 追加属性
    protected $append = [
    ];

    /**
     * 入库前
     */
//    public static function onBeforeInsert($model): void
//    {
//        $user = User::where('id', $model->user_id)->lock(true)->find();
//        if (!$user) {
//            throw new Exception("用户找不到啦");
//        }
//        if (!$model->memo) {
//            throw new Exception("变更备注不能为空");
//        }
//        $model->before = $user->score;
//
//        $user->score += $model->score;
//        $user->save();
//
//        $model->after = $user->score;
//    }
}
