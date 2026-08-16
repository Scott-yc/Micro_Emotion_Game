<?php

namespace app\api\controller;

use app\api\validate\WechatMobileValidate;
use app\common\controller\Api;
use app\common\library\Ems;
use app\common\library\Sms;
use app\common\model\BarrierRecord;
use app\common\model\ScoreLog;
use fast\Random;
use think\Config;
use think\Db;
use think\Validate;

/**
 * 会员接口
 */
class User extends Api
{
	protected $noNeedLogin = ['login', 'mobilelogin', 'register', 'resetpwd', 'changeemail', 'changemobile', 'third', 'authLogin', 'ceshi'];
	protected $noNeedRight = '*';

	public function _initialize()
	{
		parent::_initialize();

		if (!Config::get('fastadmin.usercenter')) {
			$this->error(__('User center already closed'));
		}

	}

	public function ceshi()
	{
		$this->auth->direct(13);
		halt($this->auth->getUserinfo());
	}

	/**
	 * 会员中心
	 */
	public function index()
	{
		$user = $this->auth->getUserinfo();
		$user['avatar'] = cdnurl($user['avatar'], true);
		$user['default_skin'] = $this->auth->default_skin;
		//获取本周一开始时间
		$weekStart = strtotime(date('Y-m-d', strtotime('monday this week')));
		//获取本周闯关最高的天数
		$BarrierRecord = BarrierRecord::where('uid', $this->auth->id)->where('status', 1)->where('day', '>', 0)->where('createtime', '>=', $weekStart)->order('day desc')->find();
		$user['day'] = $BarrierRecord ? $BarrierRecord['day'] : 0;
		$user['max_skin'] = $BarrierRecord ? $BarrierRecord['skin_id'] : 0;
		$this->success('', $user);
	}

	/**
	 * 会员登录
	 *
	 * @ApiMethod (POST)
	 * @ApiParams (name="account", type="string", required=true, description="账号")
	 * @ApiParams (name="password", type="string", required=true, description="密码")
	 */
	public function login()
	{
		$account = $this->request->post('account');
		$password = $this->request->post('password');
		if (!$account || !$password) {
			$this->error(__('Invalid parameters'));
		}
		$ret = $this->auth->login($account, $password);
		if ($ret) {
			$data = ['userinfo' => $this->auth->getUserinfo()];
			$this->success(__('Logged in successful'), $data);
		} else {
			$this->error($this->auth->getError());
		}
	}

	/**
	 * 授权登录
	 */
	public function authLogin()
	{
		if ($this->request->isPost()) {
			$data = $this->request->post();
			$validate = new WechatMobileValidate();
			$result = $validate->scene('login')->check($data);
			if ($result === false) {
				$this->error($validate->getError());
			}
			$result = $this->auth->authLogin($data);
			if ($result) {
				$data = ['userinfo' => $this->auth->getUserinfo()];
				$this->success(__('Logged in successful'), $data);
			} else {
				$this->error($this->auth->getError());
			}
		} else {
			$this->error('请求类型错误');
		}
	}

	/**
	 * 手机验证码登录
	 *
	 * @ApiMethod (POST)
	 * @ApiParams (name="mobile", type="string", required=true, description="手机号")
	 * @ApiParams (name="captcha", type="string", required=true, description="验证码")
	 */
	public function mobilelogin()
	{
		$mobile = $this->request->post('mobile');
		$captcha = $this->request->post('captcha');
		if (!$mobile || !$captcha) {
			$this->error(__('Invalid parameters'));
		}
		if (!Validate::regex($mobile, "^1\d{10}$")) {
			$this->error(__('Mobile is incorrect'));
		}
		if (!Sms::check($mobile, $captcha, 'mobilelogin')) {
			$this->error(__('Captcha is incorrect'));
		}
		$user = \app\common\model\User::getByMobile($mobile);
		if ($user) {
			if ($user->status != 'normal') {
				$this->error(__('Account is locked'));
			}
			//如果已经有账号则直接登录
			$ret = $this->auth->direct($user->id);
		} else {
			$ret = $this->auth->register($mobile, Random::alnum(), '', $mobile, []);
		}
		if ($ret) {
			Sms::flush($mobile, 'mobilelogin');
			$data = ['userinfo' => $this->auth->getUserinfo()];
			$this->success(__('Logged in successful'), $data);
		} else {
			$this->error($this->auth->getError());
		}
	}

	/**
	 * 注册会员
	 *
	 * @ApiMethod (POST)
	 * @ApiParams (name="username", type="string", required=true, description="用户名")
	 * @ApiParams (name="password", type="string", required=true, description="密码")
	 * @ApiParams (name="email", type="string", required=true, description="邮箱")
	 * @ApiParams (name="mobile", type="string", required=true, description="手机号")
	 * @ApiParams (name="code", type="string", required=true, description="验证码")
	 */
	public function register()
	{
		$username = $this->request->post('username');
		$password = $this->request->post('password');
		$email = $this->request->post('email');
		$mobile = $this->request->post('mobile');
		$code = $this->request->post('code');
		if (!$username || !$password) {
			$this->error(__('Invalid parameters'));
		}
		if ($email && !Validate::is($email, "email")) {
			$this->error(__('Email is incorrect'));
		}
		if ($mobile && !Validate::regex($mobile, "^1\d{10}$")) {
			$this->error(__('Mobile is incorrect'));
		}
		$ret = Sms::check($mobile, $code, 'register');
		if (!$ret) {
			$this->error(__('Captcha is incorrect'));
		}
		$ret = $this->auth->register($username, $password, $email, $mobile, []);
		if ($ret) {
			$data = ['userinfo' => $this->auth->getUserinfo()];
			$this->success(__('Sign up successful'), $data);
		} else {
			$this->error($this->auth->getError());
		}
	}

	/**
	 * 退出登录
	 * @ApiMethod (POST)
	 */
	public function logout()
	{
		if (!$this->request->isPost()) {
			$this->error(__('Invalid parameters'));
		}
		$this->auth->logout();
		$this->success(__('Logout successful'));
	}

	/**
	 * 修改会员个人信息
	 *
	 * @ApiMethod (POST)
	 * @ApiParams (name="avatar", type="string", required=true, description="头像地址")
	 * @ApiParams (name="username", type="string", required=true, description="用户名")
	 * @ApiParams (name="nickname", type="string", required=true, description="昵称")
	 * @ApiParams (name="bio", type="string", required=true, description="个人简介")
	 */
	public function profile()
	{
		$user = $this->auth->getUser();
		$username = $this->request->post('username');
		$nickname = $this->request->post('nickname');
		$bio = $this->request->post('bio');
		$avatar = $this->request->post('avatar', '', 'trim,strip_tags,htmlspecialchars');
		if ($username) {
			$exists = \app\common\model\User::where('username', $username)->where('id', '<>', $this->auth->id)->find();
			if ($exists) {
				$this->error(__('Username already exists'));
			}
			$user->username = $username;
		}
		if ($nickname) {
			$exists = \app\common\model\User::where('nickname', $nickname)->where('id', '<>', $this->auth->id)->find();
			if ($exists) {
				$this->error(__('Nickname already exists'));
			}
			$user->nickname = $nickname;
		}
		$user->bio = $bio;
		$user->avatar = $avatar;
		$user->save();
		$this->success();
	}

	/**
	 * 修改邮箱
	 *
	 * @ApiMethod (POST)
	 * @ApiParams (name="email", type="string", required=true, description="邮箱")
	 * @ApiParams (name="captcha", type="string", required=true, description="验证码")
	 */
	public function changeemail()
	{
		$user = $this->auth->getUser();
		$email = $this->request->post('email');
		$captcha = $this->request->post('captcha');
		if (!$email || !$captcha) {
			$this->error(__('Invalid parameters'));
		}
		if (!Validate::is($email, "email")) {
			$this->error(__('Email is incorrect'));
		}
		if (\app\common\model\User::where('email', $email)->where('id', '<>', $user->id)->find()) {
			$this->error(__('Email already exists'));
		}
		$result = Ems::check($email, $captcha, 'changeemail');
		if (!$result) {
			$this->error(__('Captcha is incorrect'));
		}
		$verification = $user->verification;
		$verification->email = 1;
		$user->verification = $verification;
		$user->email = $email;
		$user->save();

		Ems::flush($email, 'changeemail');
		$this->success();
	}

	/**
	 * 修改手机号
	 *
	 * @ApiMethod (POST)
	 * @ApiParams (name="mobile", type="string", required=true, description="手机号")
	 * @ApiParams (name="captcha", type="string", required=true, description="验证码")
	 */
	public function changemobile()
	{
		$user = $this->auth->getUser();
		$mobile = $this->request->post('mobile');
		$captcha = $this->request->post('captcha');
		if (!$mobile || !$captcha) {
			$this->error(__('Invalid parameters'));
		}
		if (!Validate::regex($mobile, "^1\d{10}$")) {
			$this->error(__('Mobile is incorrect'));
		}
		if (\app\common\model\User::where('mobile', $mobile)->where('id', '<>', $user->id)->find()) {
			$this->error(__('Mobile already exists'));
		}
		$result = Sms::check($mobile, $captcha, 'changemobile');
		if (!$result) {
			$this->error(__('Captcha is incorrect'));
		}
		$verification = $user->verification;
		$verification->mobile = 1;
		$user->verification = $verification;
		$user->mobile = $mobile;
		$user->save();

		Sms::flush($mobile, 'changemobile');
		$this->success();
	}

	/**
	 * 第三方登录
	 *
	 * @ApiMethod (POST)
	 * @ApiParams (name="platform", type="string", required=true, description="平台名称")
	 * @ApiParams (name="code", type="string", required=true, description="Code码")
	 */
	public function third()
	{
		$url = url('user/index');
		$platform = $this->request->post("platform");
		$code = $this->request->post("code");
		$config = get_addon_config('third');
		if (!$config || !isset($config[$platform])) {
			$this->error(__('Invalid parameters'));
		}
		$app = new \addons\third\library\Application($config);
		//通过code换access_token和绑定会员
		$result = $app->{$platform}->getUserInfo(['code' => $code]);
		if ($result) {
			$loginret = \addons\third\library\Service::connect($platform, $result);
			if ($loginret) {
				$data = [
					'userinfo'  => $this->auth->getUserinfo(),
					'thirdinfo' => $result
				];
				$this->success(__('Logged in successful'), $data);
			}
		}
		$this->error(__('Operation failed'), $url);
	}

	/**
	 * 重置密码
	 *
	 * @ApiMethod (POST)
	 * @ApiParams (name="mobile", type="string", required=true, description="手机号")
	 * @ApiParams (name="newpassword", type="string", required=true, description="新密码")
	 * @ApiParams (name="captcha", type="string", required=true, description="验证码")
	 */
	public function resetpwd()
	{
		$type = $this->request->post("type", "mobile");
		$mobile = $this->request->post("mobile");
		$email = $this->request->post("email");
		$newpassword = $this->request->post("newpassword");
		$captcha = $this->request->post("captcha");
		if (!$newpassword || !$captcha) {
			$this->error(__('Invalid parameters'));
		}
		//验证Token
		if (!Validate::make()->check(['newpassword' => $newpassword], ['newpassword' => 'require|regex:\S{6,30}'])) {
			$this->error(__('Password must be 6 to 30 characters'));
		}
		if ($type == 'mobile') {
			if (!Validate::regex($mobile, "^1\d{10}$")) {
				$this->error(__('Mobile is incorrect'));
			}
			$user = \app\common\model\User::getByMobile($mobile);
			if (!$user) {
				$this->error(__('User not found'));
			}
			$ret = Sms::check($mobile, $captcha, 'resetpwd');
			if (!$ret) {
				$this->error(__('Captcha is incorrect'));
			}
			Sms::flush($mobile, 'resetpwd');
		} else {
			if (!Validate::is($email, "email")) {
				$this->error(__('Email is incorrect'));
			}
			$user = \app\common\model\User::getByEmail($email);
			if (!$user) {
				$this->error(__('User not found'));
			}
			$ret = Ems::check($email, $captcha, 'resetpwd');
			if (!$ret) {
				$this->error(__('Captcha is incorrect'));
			}
			Ems::flush($email, 'resetpwd');
		}
		//模拟一次登录
		$this->auth->direct($user->id);
		$ret = $this->auth->changepwd($newpassword, '', true);
		if ($ret) {
			$this->success(__('Reset password successful'));
		} else {
			$this->error($this->auth->getError());
		}
	}

	//观看广告增加积分
	public function addscore()
	{
		$advertisement_obtain_points = \app\common\model\Config::where('name', 'advertisement_obtain_points')->value('value');
		if ($advertisement_obtain_points > 0) {
			// 启动事务
			Db::startTrans();
			try {
//				ScoreLog::create([
//					'user_id' => $this->auth->id,
//					'score'   => $advertisement_obtain_points,
//					'type'    => 3,
//					'memo'    => '查看广告获得' . $advertisement_obtain_points . '积分',
//				]);
				$user = $this->auth->getUser();
				$user->score($advertisement_obtain_points, $this->auth->id, '查看广告获得' . $advertisement_obtain_points . '积分', 3);
				// 提交事务
				Db::commit();
			} catch (\Exception $e) {
				// 回滚事务
				Db::rollback();
				$this->error($e->getMessage());
			}
		}
		$this->success('');
	}

	//排行榜
	public function rank()
	{
		$data = BarrierRecord::with(['user', 'skin'])->where('barrier_record.status', 1)->where('day', '>', 0)->group('uid')->field('barrier_record.*,MAX(barrier_record.day) as day,MAX(barrier_record.score) as score')->order('day desc')->select();
		foreach ($data as $item) {
			if ($item->user) {
				$item->user->avatar = cdnurl($item->user->avatar, true);
			}
			if ($item->skin) {
				$item->skin->image = cdnurl($item->skin->image, true);
//				$item->skin->image = "https://emote.xinzhiyukeji.cn/" . $item->skin->image;
			}
			$item->visible(['day', 'score', 'user' => ['nickname', 'avatar'], 'skin' => ['image']]);
		}
		$this->success('', $data);
	}
}
