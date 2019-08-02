<?php
/**
 * Copyright (c) Enalean, 2019 - present. All Rights Reserved.
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

declare(strict_types = 1);

namespace Tuleap\Docman\Test\rest\Docman;

require_once __DIR__ . '/../../../vendor/autoload.php';

use REST_TestDataBuilder;
use Tuleap\Docman\Test\rest\Helper\DocmanTestExecutionHelper;

class DocmanProjectMetadataTest extends DocmanTestExecutionHelper
{
    public function testGetMetadataForProject(): void
    {
        $response = $this->getResponse($this->client->get('projects/' . $this->project_id . '/docman_metadata'));

        $this->assertSame(200, $response->getStatusCode());

        $json_result = $response->json();

        $text_metadata = $this->findMetadataByName($json_result, "text metadata");
        $list_metadata = $this->findMetadataByName($json_result, "list metadata");

        $this->assertEquals("text metadata", $text_metadata["name"]);
        $this->assertEquals("text", $text_metadata["type"]);
        $this->assertEquals(null, $text_metadata["allowed_list_values"]);

        $this->assertEquals("list metadata", $list_metadata["name"]);
        $this->assertEquals("list", $list_metadata["type"]);

        $list_values = $list_metadata["allowed_list_values"];
        $value = $this->findValueByValueName($list_values, "value 1");
        $value_two = $this->findValueByValueName($list_values, "value 2");

        $this->assertEquals("value 1", $value["value"]);
        $this->assertEquals("value 2", $value_two["value"]);
    }

    public function testOptionsProjectMetadata(): void
    {
        $response = $this->getResponse(
            $this->client->options('projects/' . $this->project_id . '/docman_metadata'),
            REST_TestDataBuilder::ADMIN_USER_NAME
        );

        $this->assertEquals(['OPTIONS', 'GET'], $response->getHeader('Allow')->normalize()->toArray());
        $this->assertEquals($response->getStatusCode(), 200);
    }

    /**
     * @return array | null Found item. null otherwise.
     */
    private function findValueByValueName(array $list_values, string $name): ?array
    {
        $index = array_search($name, array_column($list_values, 'value'));
        if ($index === false) {
            return null;
        }
        return $list_values[$index];
    }
}