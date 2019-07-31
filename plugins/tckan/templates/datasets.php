<?php 
    $datasets = $ckan->result->results;
    $total_data = $ckan->result->count;
    $url = esc_attr( get_option( 'ckan_url' ) );
    wp_enqueue_script( 'datatable', $this->plugin_url . 'assets/datatable.js' ); 
?>
<div class="wrap">
<h1>Datasets Views</h1>
<hr>
<ul class="subsubsub">
    <li class="all">
    Total Data: <a class="current"><?php echo($total_data);?></a> 
	<strong> | </strong>
    </li>
    <li class="all">
    Instance Name: <strong><a href="<?php echo($url);?>"class="future"> <?php echo($url);?></a></strong>
    </li>
</ul>
<table class="wp-list-table widefat fixed striped comments">
    <thead>
        <tr>
            <td id="author" class="manage-column column-author sortable desc" scope="col">Dataset</td>
            <td id="comment" class="manage-column column-comment column-primary" scope="col">Files</td>
            <td id="response" class="manage-column column-response sortable desc" scope="col">Author</td>
            <td id="response" class="manage-column column-date sortable desc" scope="col">Organisation</td>
        </tr>
    </thead>
    <tbody>
    <?php foreach($datasets as $dataset) {?>
    <tr class="comment even thread-even depth-1 approved">
            <td class="author column-author">
                <strong>
                    <?php 
                            if ($dataset->title) { 
                                echo($dataset->title); 
                            }
                    ?>
                </strong>
                <div class="row-actions visible">
                    <span>
                    <?php if ( $dataset->url != null || $dataset->url ){?>
                        <a target="_blank" href="<?php echo($dataset->url);?>" class="button button-primary button-small">Visit Page</a>
                    <?php } else { ; ?>
                        <a href="#" class="button button-disabled button-small">Visit Page</a>
                    <?php }; ?>
                    </span>
                </div>
            </td>
            <td class="comment column-comment has-row-actions column-primary">
                        <ol>
                        <?php foreach($dataset->resources as $resource){?>
                        <li>
                            <kbd><?php echo($resource->format);?></kbd>
							<a href="<?php echo($resource->url)?>">
                            <strong>
								<?php
									$filetype = ucwords(strtolower($resource->name));
									$filetype = str_replace("-"," ", $filetype);
									$filetype = str_replace("_"," ", $filetype);
									$filetype = str_replace(".csv","", $filetype);
									$filetype = str_replace(".xlsx","", $filetype);
									$filetype = str_replace(".pdf","", $filetype);
									$filetype = str_replace(".json","", $filetype);
								?>
								<?php echo($filetype);?>
							</strong>
							</a>
							<a href="admin.php?page=tckan_visualisation&id=<?php echo($resource->id);?>&name=<?php echo($dataset->name);?>" class="button-dash">
								<kbd>►</kbd>
							</a>
                        </li>
                        <?php };?>
                        </ol>
            </td>
            <td class="response column-response">
                    <?php 
                            if ($dataset->organization) { 
                                echo("<strong>". $dataset->title ."</strong>"); 
                            }
                    ?>
            </td>
            <td class="date column-date">
                    <?php 
                            if ($dataset->organization) { 
                                echo("<strong>". $dataset->organization->title."</strong>"); 
                            }
                    ?>
            </td>
    </tr>
    <?php };?>
    </tbody>
    <tfoot>
        <tr>
            <td class="manage-column column-author sortable desc" scope="col">Dataset</td>
            <td class="manage-column column-comment column-primary" scope="col">Files</td>
            <td class="manage-column column-response sortable desc" scope="col">Author</td>
            <td id="response" class="manage-column column-date sortable desc" scope="col">Organisation</td>
        </tr>
    </tfoot>
</table>
</div>
</div>
