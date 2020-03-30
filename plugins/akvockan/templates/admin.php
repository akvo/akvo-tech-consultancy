<div class="wrap">
<h1>AkvoCkan Plugin Settings</h1>
<hr>
<?php settings_errors(); ?>

<form method="post" action="options.php">
    <?php 
        settings_fields( 'akvockan_options_group' );
        do_settings_sections( 'akvockan_plugin' );
        submit_button();
    ?>
</form>
</div>
