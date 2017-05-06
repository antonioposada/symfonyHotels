<?php

namespace AppBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DefaultControllerTest extends WebTestCase
{
    public function testIndex()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertGreaterThan(
            0, $crawler->filter('html:contains("HOTEL GROUP.")')->count());
    }

    public function testLoginSuccess()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/login');

        $form = $crawler->selectButton('Log in')->form();
        $crawler = $client
            ->submit($form,
                array('_username' => 'antonio',
                    '_password' =>'antonio'));

        $this->assertEquals(302, $client->getResponse()->getStatusCode());
        $crawler = $client->request('GET', '/');
        $this->assertTrue($crawler->filter('html:contains("You are logged in!")')->count() > 0, "The text 'You are logged in!' was not found");
    }

}
