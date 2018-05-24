<?php
class Istans_Quickorder_Block_Index extends Mage_Catalog_Block_Product_Abstract

{

    public function _getProducts($catId = NULL)
    {
        /* @var $productVisibility Mage_Catalog_Model_Product_Visibility */
  /*      $productVisibility = Mage::getSingleton('catalog/product_visibility');
        $this->_productCollection->setVisibility($productVisibility->getVisibleInCatalogIds());

        $productStatus = Mage::getSingleton('catalog/product_status');
        $this->_productCollection->addAttributeToFilter('status', array('in' => $productStatus->getVisibleStatusIds()));
*/
        $sortName = Mage::app()->getRequest()->getParam('sort');
        $sortDir = Mage::app()->getRequest()->getParam('dir');
        if(!isset($sortDir))$sortDir='asc';

        $collection = Mage::getModel('catalog/product')->getCollection()->addAttributeToSelect('*');
        $collection->addFieldToFilter('visibility', Mage_Catalog_Model_Product_Visibility::VISIBILITY_BOTH)
            ->addAttributeToFilter('status', array('eq' => Mage_Catalog_Model_Product_Status::STATUS_ENABLED));
        if ($catId):
            $collection->addCategoryFilter($catId);
            endif;

        if($sortName):
            $collection->addAttributeToSort($sortName, $sortDir);
        endif;

        return $collection;
    }

    public function _getCategories()
    {
      //  $categories = Mage::getModel('catalog/category')->getCollection();
        $collection = Mage::getModel('catalog/category')
            ->load(102)->getCollection()
            ->addAttributeToSelect('*')
            ->addAttributeToFilter('catalogue_display', 1)
            ->addAttributeToSort('position');


        return $collection;
    }


}