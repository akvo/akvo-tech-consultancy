<!--
<script src="{{asset('js/vendors/echarts.min.js')}}"></script>
--!>
<script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.1.0/echarts-en.common.min.js"></script>
<script src="{{asset(mix('js/global.js'))}}"></script>
<script src="{{asset(mix('js/app.js'))}}"></script>

<!-- Begin analitycs script -->
<script type="text/javascript" src="https://tc.akvo.org/analytics/analytics-left.js"></script>
<noscript><iframe src="//analytics.akvo.org/containers/f6fdd448-a2bc-4734-8aa0-dba4d0d0f2a3/noscript.html" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- end analytics script -->
@stack('scripts')
