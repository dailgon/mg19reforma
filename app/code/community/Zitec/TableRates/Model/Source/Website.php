<?php
/**
 * Zitec_Dpd – shipping carrier extension
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * @category   Zitec
 * @package    Zitec_Dpd
 * @copyright  Copyright (c) 2014 Zitec COM
 * @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */

/**
 *
 * @category   Zitec
 * @package    Zitec_Dpd
 * @author     Zitec COM <magento@zitec.ro>
 */
class Zitec_TableRates_Model_Source_Website
{

    /**
     *
     * @return array
     */
    public function getWebsites()
    {
        $websiteOptions = array();
        foreach (Mage::getModel('core/website')->getCollection() as $website) {
            $websiteOptions[$website->getId()] = $website->getName();
        }

        return $websiteOptions;
    }

    /**
     *
     * @return array
     */
    public function toOptionArray()
    {
        $options = array();
        foreach ($this->getWebsites() as $value => $name) {
            $options[] = array('label' => $name, 'value' => $value);
        }

        return $options;
    }
}

