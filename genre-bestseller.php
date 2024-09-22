<?php
/**
 * Plugin Name:       Genre Bestseller
 * Description:       Gutenberg block that generates Best seller book based on a genre
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       genre-bestseller
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_genre_bestseller_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_genre_bestseller_block_init' );

function biblio_proxy_api_get_genres() {
    $api_url = 'https://api-test.penguinrandomhouse.com/resources/v2/title/domains/PRH.UK/categories?api_key=qx4hfd2x6r4re89tbkxga2hy'; // The third-party API URL

    // Use wp_remote_get to fetch the data
    $response = wp_remote_get( $api_url );

    // Check if the request is successful
    if ( is_wp_error( $response ) ) {
        return new WP_Error( 'api_error', esc_html__( 'Unable to fetch API data.' ) );
    }

    $body = wp_remote_retrieve_body( $response );

    // Return the API response
    return rest_ensure_response( json_decode( $body ) );
}

function biblio_proxy_api_get_books_by_genre($request) {
	$genre = $request->get_param('genre');
    
	$api_url = 'https://api-test.penguinrandomhouse.com/resources/v2/title/domains/PRH.UK/works/views/list-display?api_key=qx4hfd2x6r4re89tbkxga2hy&catUri=' . $genre . '&rows=1&sort=printScore'; // The third-party API URL

    // Use wp_remote_get to fetch the data
    $response = wp_remote_get( $api_url );

    // Check if the request is successful
    if ( is_wp_error( $response ) ) {
        return new WP_Error( 'api_error', esc_html__( 'Unable to fetch API data.' ) );
    }

    $body = wp_remote_retrieve_body( $response );

    // Return the API response
    return rest_ensure_response( json_decode( $body ) );
}

function register_biblio_proxy_routes() {
    register_rest_route( 'biblio-api/v1', '/genres', array(
        'methods' => 'GET',
        'callback' => 'biblio_proxy_api_get_genres',
        'permission_callback' => '__return_true', // Can be customized for security
    ) );

	register_rest_route( 'biblio-api/v1', '/genres/bestsellers', array(
        'methods' => 'GET',
        'callback' => 'biblio_proxy_api_get_books_by_genre',
        'permission_callback' => '__return_true', // Can be customized for security
    ) );
}
add_action( 'rest_api_init', 'register_biblio_proxy_routes' );
