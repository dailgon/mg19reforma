<?php
class Istans_Quickorder_IndexController extends Mage_Core_Controller_Front_Action{
    public function IndexAction() {
      
	  $this->loadLayout();   
	  $this->getLayout()->getBlock("head")->setTitle($this->__("Quick order form"));
	        $breadcrumbs = $this->getLayout()->getBlock("breadcrumbs");
      $breadcrumbs->addCrumb("home", array(
                "label" => $this->__("Home Page"),
                "title" => $this->__("Home Page"),
                "link"  => Mage::getBaseUrl()
		   ));

      $breadcrumbs->addCrumb("quick order form", array(
                "label" => $this->__("Quick order form"),
                "title" => $this->__("Quick order form")
		   ));

      $this->renderLayout(); 
	  
    }


    public function addToCartAction() {

        if ($data = $this->getRequest()->getPost('product')) {
            $cart   = Mage::getSingleton('checkout/cart');

            try {
                foreach ($data as $row) {

                    if (!isset($row['sku']) || !isset($row['qty']) || $row['qty'] < 1) {
                        continue;
                    }

                    $productId = Mage::getModel('catalog/product')->getIdBySku($row['sku']);

                    if ($productId) {
                        $product = Mage::getModel('catalog/product')
                            ->setStoreId(Mage::app()->getStore()->getId())
                            ->load($productId);

                        $attributeName = [];
                        if (!empty($row['super_attribute'])) {
                            foreach ($row['super_attribute'] as $key => $superAtt) {
                                $attributeName += [$key => $superAtt];
                            }
                        }

                        $params = ['cart'            => 'add',
                            'product'         => $productId,
                            'related_product' => '',
                            'super_attribute' => $attributeName,
                            'qty'             => !isset($row['qty']) ? 1: $row['qty']];

                        $this->getRequest()->setparam('qty', $params['qty']);

                        $cart->addProduct($product, $params);
                        if (!empty($params['related_product'])) {
                            $cart->addProductsByIds(explode(',', $params['related_product']));
                        }

                        $cartStockMessage = Mage::app()->getResponse()->getBody();
                        if (!empty($cartStockMessage)) {
                            Mage::getSingleton('checkout/session')->addNotice($cartStockMessage);
                            Mage::app()->getResponse()->setBody('');
                        } else {
                            $message = $this->__('%s was successfully added to your shopping cart.', $product->getName());
                            Mage::getSingleton('checkout/session')->addSuccess($message);
                        }
                    }

                }

                //Cart Save needs to be the last
                $cart->save();
                Mage::getSingleton('checkout/session')->setCartWasUpdated(true);

                //Check all cart and update out of stocks
                foreach ($data as $row) {
                    $productId = Mage::getModel('catalog/product')->getIdBySku($row['sku']);
                    $product = Mage::getModel('catalog/product')
                        ->setStoreId(Mage::app()->getStore()->getId())
                        ->load($productId);

                    $attributeName = [];
                    if (!empty($row['super_attribute'])) {
                        foreach ($row['super_attribute'] as $key => $superAtt) {
                            $attributeName += [$key => $superAtt];
                        }
                    }

                    Mage::dispatchEvent('checkout_cart_add_product_complete',
                        array(
                            'product' => $product,
                            'request' => $this->getRequest(),
                            'response' => $this->getResponse(),
                            'attribute' => $attributeName)
                    );
                }

            }
            catch (Mage_Core_Exception $e) {
                if (Mage::getSingleton('checkout/session')->getUseNotice(true)) {
                    Mage::getSingleton('checkout/session')->addNotice($e->getMessage());
                } else {
                    $messages = array_unique(explode("\n", $e->getMessage()));
                    foreach ($messages as $message) {
                        Mage::getSingleton('checkout/session')->addError($message);
                    }
                }
            }
            catch (Exception $e) {
                Mage::getSingleton('checkout/session')->addException($e, $this->__('Can not add item to shopping cart'));
            }
        }

        $this->_redirect('checkout/cart');
    }



}