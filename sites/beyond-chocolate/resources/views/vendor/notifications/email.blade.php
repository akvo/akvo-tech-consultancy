@component('mail::message')
{{-- Greeting --}}
@if (! empty($greeting))
# {{ $greeting }}
@else
@if ($level === 'error')
# @lang('Whoops!')
@else
# @lang('Hello!')
@endif
@endif

{{-- Intro Lines --}}
@foreach ($introLines as $line)
{{ $line }}

@endforeach

{{-- Action Button --}}
@isset($actionText)
<?php
    switch ($level) {
        case 'success':
        case 'error':
            $color = $level;
            break;
        default:
            $color = 'primary';
    }
?>
@component('mail::button', ['url' => $actionUrl, 'color' => $color])
{{ $actionText }}
@endcomponent
@endisset

{{-- Outro Lines --}}
@foreach ($outroLines as $line)
{{ $line }}

@endforeach

{{-- Salutation --}}
@if (! empty($salutation))
{{ $salutation }}
@else
@lang('Regards'),<br>
{{ config('app.name') }}
@endif

{{-- Override --}}
<br>
Freundliche Grüße, <br/>
Forum Nachhaltiger Kakao
{{-- EOL Override --}}

{{-- Subcopy --}}
@isset($actionText)
@slot('subcopy')
{{-- @lang(
    "If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n".
    'into your web browser:',
    [
        'actionText' => $actionText,
    ]
) <span class="break-all">[{{ $displayableActionUrl }}]({{ $actionUrl }})</span> --}}

{{-- Override --}}
If you’re having trouble clicking the "Verify Email Address" button, copy and paste the URL below into your web browser:
<br/>
Wenn die Funktion  “Verify Email Address/ Emailadresse bestätigen” nicht funktionieren sollte, kopieren Sie bitte die unten stehende URL in Ihren Web-Browser:
<br/>
<span class="break-all">[{{ $displayableActionUrl }}]({{ $actionUrl }})</span>
{{-- EOL Override --}}

@endslot
@endisset
@endcomponent
