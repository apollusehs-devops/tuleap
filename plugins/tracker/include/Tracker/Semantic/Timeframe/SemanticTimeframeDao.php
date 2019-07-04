<?php
/**
 * Copyright (c) Enalean, 2019 - Present. All Rights Reserved.
 *
 * This file is a part of Tuleap.
 *
 * Tuleap is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Tuleap is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Tuleap. If not, see <http://www.gnu.org/licenses/>.
 */

declare(strict_types=1);

namespace Tuleap\Tracker\Semantic\Timeframe;

use Tuleap\DB\DataAccessObject;

class SemanticTimeframeDao extends DataAccessObject
{
    /**
     * @psalm-return array{start_date_field_id: int, duration_field_id: ?int}|null
     */
    public function searchByTrackerId(int $tracker_id): ?array
    {
        $sql = 'SELECT start_date_field_id, duration_field_id
                FROM tracker_semantic_timeframe
                WHERE tracker_id = ?';

        return $this->getDB()->row($sql, $tracker_id);
    }
}