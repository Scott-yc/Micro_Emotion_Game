<?php

namespace app\admin\controller\bullet;

use app\common\controller\Backend;

/**
 * 子弹升级配置
 *
 * @icon fa fa-circle-o
 */
class Range extends Backend
{

    /**
     * Range模型对象
     * @var \app\admin\model\bullet\Range
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\bullet\Range;
        $this->view->assign("typeList", $this->model->getTypeList());
    }
    /**
     * 查看
     */
    public function index()
    {
        //设置过滤方法
        $this->request->filter(['strip_tags', 'trim']);
        if ($this->request->isAjax()) {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField')) {
                return $this->selectpage();
            }
            $filter = json_decode($this->request->get('filter'),true);
            $op = json_decode($this->request->get('op'),true);
            $filter['type'] = 2;
            $op['type'] = '=';
            $where = [
                'filter' => json_encode($filter),
                'op' => json_encode($op),
            ];
            $this->request->get($where);
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $list = $this->model
                ->where($where)
                ->order($sort, $order)
                ->paginate($limit);
            $result = array("total" => $list->total(), "rows" => $list->items());

            return json($result);
        }
        return $this->view->fetch();
    }


    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */


}
