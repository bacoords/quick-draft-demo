<?php
/**
 * Plugin Name:     Quick Draft Demo
 * Plugin URI:      https://github.com/bacoords/quick-draft-demo
 * Description:     A demo plugin for auick draft
 * Author:          Brian Coords
 * Author URI:      https://briancoords.com
 * Text Domain:     quick-draft-demo
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         Quick_Draft_Demo
 */

// Your code starts here.
function add_quick_draft_demo_widget() {
	wp_add_dashboard_widget( 'quick-draft-demo-widget', 'Quick Draft Demo', 'render_quick_draft_demo_widget' );
}
add_action( 'wp_dashboard_setup', 'add_quick_draft_demo_widget' );

function render_quick_draft_demo_widget() {
	echo '<div id="quick-draft-demo"></div>';
}


function load_custom_wp_admin_scripts( $hook ) {
	// Load only on ?page=my-first-gutenberg-app.
	if ( 'index.php' !== $hook ) {
		return;
	}

	// Load the required WordPress packages.

	// Automatically load imported dependencies and assets version.
	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	// Enqueue CSS dependencies.
	foreach ( $asset_file['dependencies'] as $style ) {
		wp_enqueue_style( $style );
	}

	// Load our app.js.
	wp_register_script(
		'quick-draft-demo',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version']
	);
	wp_enqueue_script( 'quick-draft-demo' );

}

add_action( 'admin_enqueue_scripts', 'load_custom_wp_admin_scripts' );
