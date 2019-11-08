<nav class="navbar navbar-expand-lg fixed-top navbar-light bg-light">
  <img class="navbar-brand" src="{{ asset('/images/2scale_logo.gif') }}"/>
  <button class="navbar-toggler p-0 border-0" type="button" data-toggle="offcanvas">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="navbar-collapse offcanvas-collapse">
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a class="nav-link {{Route::is('home') ? 'active' : '' }}" href="/database"><i class="fas fa-database"></i> Home</a>
      </li>
      <li class="nav-item">
        <a class="nav-link {{Route::is('report') ? 'active' : '' }}" href="/database"><i class="fas fa-database"></i> Report</a>
      </li>
      <li class="nav-item">
        <a class="nav-link {{Route::is('data') ? 'active' : '' }}" href="/database"><i class="fas fa-database"></i> Data</a>
      </li>
      <li class="nav-item">
        <a class="nav-link {{Route::is('index') ? 'active' : '' }}" href="/"><i class="fas fa-list-ul"></i> Survey</a>
      </li>
    </ul>
  </div>
</nav>
