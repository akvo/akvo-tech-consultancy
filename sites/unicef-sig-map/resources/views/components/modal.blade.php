<div class="modal fade" id="detail_modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="school_name"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"><i class="fas fa-times"></i></span>
        </button>
            </div>
            <div class="modal-body">
                <div class="modal-input">
                <input type="text" id="myInput" style="margin-bottom: 10px;" class="form-control" onkeyup="autoQuestion()" placeholder="Search Question..">
                <input type="text" id="myOutput" class="form-control" onkeyup="autoAnswer()" placeholder="Search Answer..">
                </div>
                <div id="school_desc">
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                      <li class="nav-item">
                        <a class="nav-link active" id="profile-menu" data-toggle="tab" href="#profile-tab" role="tab" aria-controls="profile-tab" aria-selected="true">School Profile</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" id="water_supply-menu" data-toggle="tab" href="#water_supply-tab" role="tab" aria-controls="water_supply-tab" aria-selected="false">Water Supply</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" id="sanitation-menu" data-toggle="tab" href="#sanitation-tab" role="tab" aria-controls="sanitation-tab" aria-selected="false">Sanitation</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" id="hygiene-menu" data-toggle="tab" href="#hygiene-tab" role="tab" aria-controls="hygiene-tab" aria-selected="false">Hygiene</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" id="management-menu" data-toggle="tab" href="#management-tab" role="tab" aria-controls="management-tab" aria-selected="false">School Management</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" id="photo-menu" data-toggle="tab" href="#photo-tab" role="tab" aria-controls="photo-tab" aria-selected="false"><i class="fa fa-camera"></i></a>
                      </li>
                    </ul>
                    <div class="tab-content" id="myTabContent">
                        <div class="tab-pane fade show active" id="profile-tab" role="tabpanel" aria-labelledby="profile-menu"></div>
                        <div class="tab-pane fade" id="water_supply-tab" role="tabpanel" aria-labelledby="water_supply-menu"></div>
                        <div class="tab-pane fade" id="sanitation-tab" role="tabpanel" aria-labelledby="sanitation-menu"></div>
                        <div class="tab-pane fade" id="hygiene-tab" role="tabpanel" aria-labelledby="hygiene-menu"></div>
                        <div class="tab-pane fade" id="management-tab" role="tabpanel" aria-labelledby="management-menu"></div>
                        <div class="tab-pane fade" id="photo-tab" role="tabpanel" aria-labelledby="photo-menu">
                            <div id="carouselControls" class="carousel slide" data-ride="carousel">
								<div class="carousel-inner">
								</div>
									<a class="carousel-control-prev" href="#carouselControls" role="button" data-slide="prev">
										<span class="carousel-control-prev-icon" aria-hidden="true"></span>
										<span class="sr-only">Previous</span>
									</a>
									<a class="carousel-control-next" href="#carouselControls" role="button" data-slide="next">
										<span class="carousel-control-next-icon" aria-hidden="true"></span>
										<span class="sr-only">Next</span>
									</a>
							</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer" id="school_feature">
            </div>
        </div>
    </div>
</div>
