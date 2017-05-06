<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function indexAction(Request $request)
    {

        $user = $this->getUser();
        dump($this->get('security.authorization_checker')->isGranted('ROLE_ADMIN'));
        /* Si estamos logados vamos al menu de configuracion */
        if (is_object($user) && $user->getRoles()){
            return $this->backendMenu($request);
        }

        $em = $this->getDoctrine()->getManager();
        $hotels = $em->getRepository('AppBundle:Hotel')
            ->findAll();

        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', array(
            'base_dir' => realpath($this->container->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
            'count_hotels' => count($hotels),
            'hotels' => $hotels
        ));
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    private function backendMenu(Request $request){

        return $this->render('@App/home.html.twig', array(
            'base_dir' => realpath($this->container->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR
        ));
    }
}
