/*
 * Copyright (c) Enalean, 2020 - present. All Rights Reserved.
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

import FieldChosenTemplate from "./FieldChosenTemplate.vue";
import { shallowMount, Wrapper } from "@vue/test-utils";
import { createStoreMock } from "../../../../../../../../../src/scripts/vue-components/store-wrapper-jest";
import { createTrackerCreationLocalVue } from "../../../../helpers/local-vue-for-tests";
import { ProjectTemplate, State } from "../../../../store/type";

describe("FieldChosenTemplate", () => {
    let state: State;

    async function getWrapper(
        state: State,
        is_a_duplication = false,
        is_a_xml_import = false,
        is_created_from_empty = false,
        is_a_duplication_of_a_tracker_from_another_project = false,
        project_of_selected_tracker_template: ProjectTemplate | null = null,
        is_created_from_default_template = false
    ): Promise<Wrapper<FieldChosenTemplate>> {
        return shallowMount(FieldChosenTemplate, {
            mocks: {
                $store: createStoreMock({
                    state,
                    getters: {
                        is_created_from_empty,
                        is_a_duplication,
                        is_a_xml_import,
                        is_a_duplication_of_a_tracker_from_another_project,
                        project_of_selected_tracker_template,
                        is_created_from_default_template,
                    },
                }),
            },
            localVue: await createTrackerCreationLocalVue(),
        });
    }

    beforeEach(() => {
        state = {
            tracker_to_be_created: {
                name: "Tracker XML structure",
                shortname: "tracker_to_be_created",
            },
            selected_tracker_template: {
                id: "1",
                name: "Tracker from a template project",
            },
            selected_project: {
                id: "150",
                name: "Another project",
            },
            selected_project_tracker_template: {
                id: "2",
                name: "Tracker from another project",
            },
        } as State;
    });

    describe("It displays the right template name when", () => {
        it("is a default template", async () => {
            state = {
                selected_tracker_template: {
                    id: "default-bug",
                    name: "Bugs",
                },
            } as State;

            const wrapper = await getWrapper(state, false, false, false, false, null, true);
            expect(wrapper.find("[data-test=project-of-chosen-template]").exists()).toBe(false);
            expect(wrapper.get("[data-test=chosen-template]").text()).toEqual("Bugs");
        });

        it("is a tracker duplication", async () => {
            const wrapper = await getWrapper(state, true, false, false, false, {
                project_name: "Default Site Template",
                tracker_list: [],
            });

            expect(wrapper.get("[data-test=project-of-chosen-template]").text()).toEqual(
                "Default Site Template"
            );

            expect(wrapper.get("[data-test=chosen-template]").text()).toEqual(
                "Tracker from a template project"
            );
        });

        it("is a xml export", async () => {
            const wrapper = await getWrapper(
                {
                    tracker_to_be_created: {
                        name: "Tracker XML structure",
                        shortname: "tracker_to_be_created",
                    },
                } as State,
                false,
                true
            );

            expect(wrapper.find("[data-test=project-of-chosen-template]").exists()).toBe(false);
            expect(wrapper.get("[data-test=chosen-template]").text()).toEqual(
                "Tracker XML structure"
            );
        });

        it("is created from empty", async () => {
            const wrapper = await getWrapper(state, false, false, true);

            expect(wrapper.find("[data-test=project-of-chosen-template]").exists()).toBe(false);
            expect(wrapper.get("[data-test=chosen-template]").text()).toEqual("Empty");
        });

        it("is a duplication of a tracker from another project", async () => {
            const wrapper = await getWrapper(state, false, false, false, true);

            expect(wrapper.get("[data-test=project-of-chosen-template]").text()).toEqual(
                "Another project"
            );
            expect(wrapper.get("[data-test=chosen-template]").text()).toEqual(
                "Tracker from another project"
            );
        });
    });
});
