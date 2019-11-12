<title><?=$title?></title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no">
<link href="<?=base_url()?>resources/bootstrap-3.3.2-dist/css/bootstrap.min.css" rel="stylesheet"/>
<link href="<?=base_url()?>resources/silviomoreto-bootstrap-select/bootstrap-select.min.css" rel="stylesheet"/>
<link href="<?=base_url()?>resources/css/style.css" rel="stylesheet"/>
<link rel="stylesheet" href="https://cartodb-libs.global.ssl.fastly.net/cartodb.js/v3/3.15/themes/css/cartodb.css" />
<script type="text/javascript" src="<?=base_url()?>resources/js/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="<?=base_url()?>resources/js/iframeResizer.contentWindow.min.js"></script>
<div class="container-fluid">
<nav class="navbar navbar-default" role="navigation" style="margin-top: 15px">
	<div class="container-fluid">
		<!-- Brand and toggle get grouped for better mobile display -->
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<div class="navbar-brand"><?=$title?></div>
		</div>

		<!-- Collect the nav links, forms, and other content for toggling -->
		<div class="collapse navbar-collapse" id="navbar-collapse">
			<?php /*<ul class="nav navbar-nav">
				<?php foreach ($visualisation_details as $link => $details):?>
				<li class="dropdown" id="<?=$link?>_link">
					<a href="<?=base_url()?>index.php/<?=$link?>"><?=$details['link_title']?></a>
				</li>
				<?php endforeach;?>

			</ul>*/?>
			<p class="navbar-text navbar-right">
				<a href="https://akvo.org" target="_blank" class="navbar-link" style="float: right">
					<img alt="logout" src="<?=base_url()?>/resources/images/Akvo_RGB_logo.png" style="height: 20px">
				</a>
			</p>
		</div><!-- /.navbar-collapse -->
	</div><!-- /.container-fluid -->
</nav>
