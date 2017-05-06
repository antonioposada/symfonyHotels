<?php

namespace AppBundle\Tests\Repository;

use AppBundle\Repository\HotelRepository;
use Proxies\__CG__\AppBundle\Entity\Hotel;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class HotelRepositoryTest extends KernelTestCase
{
    /**
     * @var \Doctrine\ORM\EntityManager
     */
    private $em;

    /**
     * @var HotelRepository
     */
    private $hotelRepository;

    /**
     * {@inheritDoc}
     */
    protected function setUp()
    {
        self::bootKernel();

        $this->em = static::$kernel->getContainer()
            ->get('doctrine')
            ->getManager();

        $this->hotelRepository = $this->em
            ->getRepository('AppBundle:Hotel');
    }

    public function testExitsHotels()
    {
        $hotels = $this->hotelRepository->findAll();

        $this->assertGreaterThan(
            0, count($hotels));
    }

    public function testcreateHotel(){
        $hotel = new Hotel();
        $hotel->setName('Test');
        $hotel->setCategory(4);
        $hotel->setAddress('Glorieta puerta de toledo,3, 28005 Madrid');
        $hotel->setCreatedAt(new \DateTime('tomorrow'));
        $hotel->setUpdatedAt(new \DateTime('tomorrow'));

        $this->em->persist($hotel);
        $this->em->flush();

        $hoteldb = $this->hotelRepository->findOneBy(array(
            'name'  => $hotel->getName(),
            'category' => $hotel->getCategory(),
            'address'=> $hotel->getAddress()
        ));

        $this->assertEquals($hotel, $hoteldb);
    }

    public function testupdateHotel(){
        $hotel = $this->hotelRepository->findOneBy(array(
            'name'  => 'Test'));
        $hotel->setCategory(3);

        $this->em->persist($hotel);
        $this->em->flush();

        $hoteldb = $this->hotelRepository->findOneBy(array(
            'name'  => $hotel->getName(),
            'category' => $hotel->getCategory(),
            'address'=> $hotel->getAddress()
        ));

        $this->assertEquals($hotel, $hoteldb);
    }


    public function testdeleteHotel(){
        $hotel = $this->hotelRepository->findOneBy(array(
            'name'  => 'Test'));

        $this->em->remove($hotel);
        $this->em->flush();
    }

    /**
     * {@inheritDoc}
     */
    protected function tearDown()
    {
        parent::tearDown();

        $this->em->close();
        $this->em = null; // avoid memory leaks
    }
}