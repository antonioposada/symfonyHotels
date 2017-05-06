<?php

namespace AppBundle\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class ConfigController extends Controller
{
    protected $em;

    public function getRepositoryModel(){
        $this->em = $this->getDoctrine()->getManager();
        return $this->em->getRepository('AppBundle:'.$this->model);
    }
}