<?php

/*
 * This file is part of electrolysis743/userip-custom.
 *
 * Copyright (c) 2025 electrolysis743.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace UseripCustom\CustomIpApi;

use Flarum\Extend;

return [
    
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),
        
    new Extend\Locales(__DIR__.'/locale'),
];
