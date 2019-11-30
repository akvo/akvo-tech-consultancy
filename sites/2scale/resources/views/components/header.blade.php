<nav class="navbar navbar-expand-lg fixed-top navbar-dark blue-gradient">
  <img class="navbar-brand" src="{{ asset('/images/2scale_logo_white.png') }}"/>
  <button class="navbar-toggler p-0 border-0" type="button" data-toggle="offcanvas">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="navbar-collapse offcanvas-collapse">
    <ul class="navbar-nav ml-auto">
      <li class="nav-item {{Route::is('home') ? 'active' : '' }}">
        <a class="nav-link" href="/"><i class="fas fa-tachometer-alt"></i> Home</a>
      </li>
      <li class="nav-item {{Route::is('reachreact') ? 'active' : '' }}">
        <a class="nav-link" href="/reach-and-react"><i class="fas fa-compass"></i> R&R</a>
      </li>
      <li class="nav-item {{Route::is('database') ? 'active' : '' }}">
        <a class="nav-link" href="/database"><i class="fas fa-database"></i> Database</a>
      </li>
      <li class="nav-item {{Route::is('organisation') ? 'active' : '' }}">
        <a class="nav-link" href="/organisation"><i class="fas fa-sitemap"></i> Organisation</a>
      </li>
      <li class="nav-item {{Route::is('survey') ? 'active' : '' }}">
        <a class="nav-link" href="/survey"><i class="fas fa-list-ul"></i> Survey</a>
      </li>
    </ul>
  </div>
</nav>
