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

<hr /> <br/>

{{-- Override --}}
<br>Guten Tag!</br><br/>
Vielen Dank für Ihre Registrierung für das Monitoring für das Berichtsjahr 2020.
Bitte klicken Sie auf dieses Feld um Ihre Emailadresse zu bestätigen.<br/>

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
Emailadresse bestätigen
@endcomponent
@endisset

Wenn sie keine Registrierung vorgenommen haben, ignorieren Sie bitte diese Email.

<br>
Freundliche Grüße, <br/>
Forum Nachhaltiger Kakao


{{-- Subcopy --}}
@isset($actionText)
@slot('subcopy')
@lang(
    "If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n".
    'into your web browser:',
    [
        'actionText' => $actionText,
    ]
) <br/>
Wenn die Funktion  “Verify Email Address/ Emailadresse bestätigen” nicht funktionieren sollte, kopieren Sie bitte die unten stehende URL in Ihren Web-Browser:
<br/>
<span class="break-all">[{{ $displayableActionUrl }}]({{ $actionUrl }})</span>
@endslot
@endisset

@endcomponent
