import { LitElement, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { DualFlowVentilationCardConfig } from "./dual-flow-ventilation-card-config";

@customElement("dual-flow-ventilation-card-editor")
export class DualFlowVentilationCardEditor extends LitElement {
    private config?: DualFlowVentilationCardConfig;
    public hass? : any;

    static get properties() {
        return {
            hass: { attribute: false },
            config: { state: true },
        };
    }

    public setConfig(config : DualFlowVentilationCardConfig): void {
        this.config = config;
    }

    public render() : TemplateResult {
        if (!this.hass || !this.config) {
            return html ``;
        }
        return html `
            <ha-form
                .hass=${this.hass}
                .data=${this.config}
                .schema=${this._getSchema(this.config)}
                .computeLabel=${(s) => s.label || s.name}
                @value-changed=${this._valueChanged}
            ></ha-form>
        `;
    }

    private _getSchema(config) {
        const schema = [
            {
                name: "temperatures",
                type: "grid",
                schema: [
                    { name: "extract_air", label: "Extract Air", selector: { entity: {} } },
                    { name: "outdoor_air", label: "Outdoor Air", selector: { entity: {} } },
                    { name: "supply_air",  label: "Supply Air", selector: { entity: {} } },
                    { name: "exhaust_air", label: "Exhaust Air", selector: { entity: {} } },
                ],
            },
            {
                name: "entities",
                type: "grid",
                schema: [
                    {
                        name: "ventilation_unit", label: "Ventilation Unit",
                        selector: { entity: { domain: "fan" } },
                    },
                    {
                        name: "additional_entity", label: "Additional Entity",
                        selector: { entity: {} },
                    },
                    {
                        name: "ventilation_unit_state",
                        label: "Ventilation Unit State",
                        selector: { entity: {} },
                    },
                    {
                        name: "ventilation_unit_efficiency",
                        label: "Ventilation Unit Efficiency",
                        helper: "alma",
                        selector: { entity: {} },
                    },
                ],
            },
        ];

        if (config?.entities?.ventilation_unit) {
            let ventilationUnit = this.hass.states[config.entities.ventilation_unit];
            let presetModes = ventilationUnit.attributes.preset_modes || [];

            const setDefaultPreset = (button, index) => {
                if (presetModes.length <= index) return;
                const modeKey = `${button}_mode`;
                const iconKey = `${button}_icon`;
                const presets = (config.presets ??= {});
                presets[modeKey] ??= presetModes[index];
                if (!presets[iconKey] && presets[modeKey]) {
                    presets[iconKey] = this._getDefaultPresetIcon(presets[modeKey]);
                }
            };

            const presetButtons = ["left", "middle", "right"];
            const modesSchema: { name: string, label: string, selector: any }[] = [];
            const iconsSchema: { name: string, label: string, selector: any }[] = [];
            presetButtons.forEach((button, index) => {
                setDefaultPreset(button, index);
                modesSchema.push({
                    name: `${button}_mode`,
                    label: `${button.charAt(0).toUpperCase()}${button.slice(1)}`,
                    selector: { select: { options: presetModes, mode: "dropdown" } },
                });
                iconsSchema.push({
                    name: `${button}_icon`,
                    label: " ",
                    selector: { icon: {} },
                });
            });

            schema.push({
                name: "presets", label: "Presets",
                type: "expandable", icon: "mdi:button-pointer",
                schema: [
                    { type: "grid", column_min_width: "140px", schema: modesSchema } as any,
                    { type: "grid", column_min_width: "140px", schema: iconsSchema } as any,
                ],
            } as any);
        }
        return schema;
    }

    private _valueChanged(ev : CustomEvent): void {
        const config = ev.detail.value;
        this.config = config;
        const event = new Event("config-changed", {
            bubbles: true,
            cancelable: false,
            composed: true,
        });
        (event as any).detail = { config };
        this.dispatchEvent(event);
    }

    private _getDefaultPresetIcon(presetMode : string) {
        const iconMap = {
            'auto': 'mdi:fan-auto', 'smart': 'mdi:fan-auto',
            'nature': 'mdi:leaf', 'natural': 'mdi:leaf',
            'eco': 'mdi:sprout', 'economy': 'mdi:sprout',
            'sleep': 'mdi:weather-night', 'night': 'mdi:weather-night',
            'away': 'mdi:home-off-outline',
            'boost': 'mdi:flash', 'turbo': 'mdi:flash',
            'gentle': 'mdi:feather', 'soft': 'mdi:feather',
            'quiet': 'mdi:volume-off', 'silent': 'mdi:volume-off',
            'low': 'mdi:fan-speed-1',
            'medium': 'mdi:fan-speed-2',
            'high': 'mdi:fan-speed-3',
            'home': 'mdi:home',
            'activity': 'mdi:motion-sensor',
            'favorite': 'mdi:star',
            'breeze': 'mdi:weather-windy',
            'dry': 'mdi:mdi:water-percent',
        }
        return iconMap[presetMode?.toLowerCase()] || 'mdi:fan';
    }
}

// vim: set ts=4 sw=4 et:
