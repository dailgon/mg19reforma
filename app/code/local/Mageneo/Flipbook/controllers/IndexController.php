<?php

class Mageneo_Flipbook_IndexController extends Mage_Core_Controller_Front_Action
{
    public function indexAction()
    {
        $this->loadLayout();
        $layout = $this->getLayout();
        $this->renderLayout();
    }
}