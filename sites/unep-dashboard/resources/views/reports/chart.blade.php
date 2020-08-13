<div class="content">
    <div class="table-responsive-md">
        <table width="100%" class="borderless">
            <tbody>
                <tr>
                    @if ($block == 1)
                        <td colspan="2">
                            <img width="100%" class="mx-auto" src="{{ $item }}">
                        </td>
                    @elseif ($block == 2)
                        <td>1</td>
                        <td></td>
                    @endif
                </tr>
            </tbody>
        </table>
    </div>
</div>