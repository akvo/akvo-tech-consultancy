<div class="modal fade" id="security_modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document" style="max-width:400px;">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title text-center">Download</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"><i class="fa fa-times"></i></span>
        </button>
            </div>
            <div class="modal-body">
				<div class="col-md-12">
						<form onsubmit="sendRequest()"> 
							<div class="form-group row">
								<div class="col-md-12">
									<input id="secure-pwd" type="password" class="form-control">
								</div>
							</div>

							<div class="form-group row mb-0">
								<div class="col-md-12">
									<a onclick="sendRequest()" class="btn btn-primary btn-block" style="color:#fff;">Enter Security Code</a>
								</div>
							</div>
						</form>
				</div>
            </div>
            <div class="modal-footer"> 
				<div class="col-md-12" style="text-align:center;">
                    <div id='error-download' style="text-align:center;color:red; display:none">
                        Wrong Code Verification
                    </div>
					I don't have verification code. <a href="http://www.mehrd.gov.sb/our-contacts" target="_blank">Contact Us </a>
				</div>
            </div>
        </div>
    </div>
</div>
