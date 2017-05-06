<?php
/**
 * Created by PhpStorm.
 * User: posada
 * Date: 06/05/2017
 * Time: 12:21
 */

namespace AppBundle\Controller;


use Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException;
use AppBundle\Form\HotelFormType;

class HotelController extends ConfigController
{
    protected $model = 'Hotel';

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function hotelsAction()
    {
        $hotels = $this->getRepositoryModel()->findAll();

        // replace this example code with whatever you need
        return $this->render('@App/config/hotels/hotels.html.twig', array(
            'count_hotels' => count($hotels),
            'hotels' => $hotels
        ));
    }

    /**
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function newAction()
    {
        $requestStack = $this->get('request_stack');
        $request = $requestStack->getCurrentRequest();

        $form = $this->createForm(HotelFormType::class);
        // only handles data on POST
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $hotel = $form->getData();
            $em = $this->getDoctrine()->getManager();
            $em->persist($hotel);
            $em->flush();
            $this->addFlash('success', 'Hotel created!');
            return $this->redirectToRoute('_hotels');
        }
        return $this->render('@App/config/hotels/hotel.html.twig', [
            'hotelForm' => $form->createView()
        ]);
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function editAction($id)
    {
        $requestStack = $this->get('request_stack');
        $request = $requestStack->getCurrentRequest();

        $hotel = $this->getRepositoryModel()->find($id);

        $form = $this->createForm(HotelFormType::class, $hotel);
        // only handles data on POST
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $hotel = $form->getData();

            $this->em->persist($hotel);
            $this->em->flush();
            $this->addFlash('success', 'Hotel updated!');
            return $this->redirectToRoute('_hotels');
        }
        return $this->render('@App/config/hotels/hotel.html.twig', [
            'hotelForm' => $form->createView()
        ]);
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function hotelDeleteAction($id){
        $hotel = $this->getRepositoryModel()->find($id);
        try {
            $this->em->remove($hotel);
            $this->em->flush();
            $this->addFlash('success', 'Hotel deleted!');
        }catch(ForeignKeyConstraintViolationException $e){
            $this->addFlash('danger', 'El hotel tiene asignadas habitaciones, no puede eliminarse');
        }

        return $this->redirectToRoute('_hotels');
    }

}