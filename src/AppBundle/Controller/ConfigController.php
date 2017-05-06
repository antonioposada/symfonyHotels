<?php

namespace AppBundle\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use AppBundle\Entity\Hotel;

class ConfigController extends Controller
{

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function hotelsAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $hotels = $em->getRepository('AppBundle:Hotel')
            ->findAll();

        $hotel = new Hotel();
        $hotel->setName('Hotel puerta toledo');
        $hotel->setCategory(4);
        $hotel->setAddress('Glorieta puerta de toledo,3, 28005 Madrid');
        $hotel->setCreatedAt(new \DateTime('tomorrow'));
        $hotel->setUpdatedAt(new \DateTime('tomorrow'));

        $form = $this->createFormBuilder($hotel)
            ->add('name', 'text', array('label' => 'Name: '))
            ->add('category', null)
            ->add('address', 'text')
            ->add('createdAt', 'datetime')
            ->add('UpdatedAt', 'datetime')
            ->add('save', 'submit')
            ->getForm();


        // replace this example code with whatever you need
        return $this->render('@App/config/hotels.html.twig', array(
            'count_hotels' => count($hotels),
            'hotels' => $hotels,
            'form' => $form->createView(),
            'alert' => false,
            'error' => false
        ));
    }

    public function createHotelAction(Request $request){


    }
}