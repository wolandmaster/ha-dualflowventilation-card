import { LitElement, html, css, CSSResultGroup, TemplateResult } from "lit";
import { customElement, } from "lit/decorators.js";
import { DualFlowVentilationCardConfig } from "./dual-flow-ventilation-card-config";
import { DualFlowVentilationCardEditor } from "./dual-flow-ventilation-card-editor";

@customElement('dual-flow-ventilation-card')
export class DualFlowVentilationCard extends LitElement {

    private config?: DualFlowVentilationCardConfig;
    public hass? : any;

    static get properties() {
        return {
            hass: {},
            config: {},
        };
    }

    public static async getConfigElement() : Promise<DualFlowVentilationCardEditor> {
        await import("./dual-flow-ventilation-card-editor");
        return document.createElement('dual-flow-ventilation-card-editor') as DualFlowVentilationCardEditor;
    }

    static async getStubConfig() : Promise<DualFlowVentilationCardConfig> {
        return {}
    }

    setConfig(config : DualFlowVentilationCardConfig) {
        this.config = config;
    }

    getCardSize() {
        return 3;
    }

    private getStateValue(entityId?: string): number {
        const value = parseFloat(entityId ? this.hass.states[entityId]?.state : "");
        return isNaN(value) ? 0 : value;
    }

    private getEntityAttribute(entityId: string, attribute: string): string {
        return this.hass.states[entityId]?.attributes[attribute] ?? "";
    }

    private getEntityValue(entityId: string): string {
        const unit = this.getEntityAttribute(entityId, "unit_of_measurement");
        return `${this.hass.states[entityId]?.state ?? ""} ${unit}`.trim()
    }

    private getEntityIcon(entityId: string): string {
        const domain = entityId.split(".")[0];
        return this.getEntityAttribute(entityId, "icon") ||
            {
                carbon_dioxide: "mdi:molecule-co2", moisture: "mdi:water-percent",
                problem: "mdi:alert-circle", smoke: "mdi:smoke-detector",
                humidity: "mdi:water-percent", pressure: "mdi:gauge",
                power: "mdi:flash", temperature: "mdi:thermometer",
                volatile_organic_compounds: "mdi:molecule", duration: "mdi:calendar-clock",
            }[this.getEntityAttribute(entityId, "device_class")] ||
            {
                fan: "mdi:fan", binary_sensor: "mdi:checkbox-marked-circle",
            }[domain] ||
            "mdi:eye";
    }

    private getUnitStateIcon(unitState : string) {
        const iconMap = {
            'bypass': 'mdi:arrow-right-top-bold', 'defrost': 'mdi:snowflake-melt',
            'humidity recovery': 'mdi:water-percent', 'fireplace mode': 'mdi:fireplace',
        }
        return iconMap[unitState?.toLowerCase()] || 'mdi:swap-horizontal-bold';
    }


    private showEntityInfo(entityId: string) {
        const event = new Event("hass-more-info", {
            bubbles: true, cancelable: false, composed: true,
        });
        (event as any).detail = { entityId };
        this.dispatchEvent(event);
        return event;
    }

    private setPresetMode(presetMode: string) {
        if (!this.hass || !this.config?.entities?.ventilation_unit) return;
        this.hass.callService(
            "fan", "set_preset_mode",
            { preset_mode: presetMode },
            { entity_id: this.config.entities.ventilation_unit }
        );
    }

    private renderTemperature(sensor, label) {
        return html `
            <div>
                <div class="dfvc-temp-label">${label}</div>
                <div class="dfvc-temp-value" @click="${() => this.showEntityInfo(sensor)}">
                    ${this.getEntityValue(sensor) || "-"}
                </div>
            </div>
        `;
    }

    private renderEntityInfo(entity, value) {
        return entity ? html `<span @click="${() => this.showEntityInfo(entity)}">${value}</span>` : value;
    }

    private renderExchangerImage() {
        return html `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="50" height="50" viewBox="0 0 50 50" xml:space="preserve">
                <desc>Created with Fabric.js 4.6.0</desc>
                <g transform="matrix(0.62 0 0 0.53 24 25)" id="tRjiNB6GNj8ZKCBHF_5um"><path style="stroke: rgb(114,114,114); stroke-width: 3; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(242,242,242); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(0, 0)" d="M 16.23943 -28.12732 L 32.47864 0 L 16.23943 28.12732 L -16.23943 28.12732 L -32.47864 0 L -16.23943 -28.12732 z" stroke-linecap="round" /></g>
                <g transform="matrix(0.2 0 0 0.3 25.5 24)" id="MsTeVBfavi5luTNjGOiGS"><path style="stroke: rgb(49,168,247); stroke-width: 4; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-opacity: 0; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(0, 0)" d="M -110 40 L -90 40 L 90 -40 L 110 -40" stroke-linecap="round" /></g>
                <g transform="matrix(0 -0.1 0.06 0 2.5 36)" id="ZQElss-eOJlMrdixjCwS7"><path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(49,168,247); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(-40, -40)" d="M 60 40 L 80 80 L 40 80 L 0 80 L 20 40 L 40 0 L 60 40 z" stroke-linecap="round" /></g>
                <g transform="matrix(0 -0.1 -0.06 0 47.5 36)" id="tJXkie3lntCwzfM0th5MP"><path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(49,168,247); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(-40, -40)" d="M 60 40 L 80 80 L 40 80 L 0 80 L 20 40 L 40 0 L 60 40 z" stroke-linecap="round" /></g>
                <g transform="matrix(-0.19 0 0 0.3 24 24)" id="RR9eEmjzxuPtw2nl0KhXz"><path style="stroke: rgb(49,168,247); stroke-width: 4; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(0, 0)" d="M -110 40 L -90 40 L 90 -40 L 110 -40" stroke-linecap="round" /></g>
            </svg>
        `;
    }

    public render() : TemplateResult {
        if (!this.hass || !this.config) {
            return html ``;
        }

        const entities: { entity: string, value: string }[] = [];
        const additionalEntity = this.config.entities?.additional_entity;
        if (additionalEntity) {
            entities.push({
                entity: additionalEntity,
                value: this.getEntityValue(additionalEntity)
            });
        }
        const ventilationUnit = this.config.entities?.ventilation_unit;
        if (ventilationUnit) {
            entities.push({
                entity: ventilationUnit,
                value: this.getEntityAttribute(ventilationUnit, "percentage") + " %"
            });
        }

        const presets: { mode: string, icon: string }[] = [];
        if (ventilationUnit && this.config?.presets) {
            ["left", "middle", "right"].forEach((button) => {
                presets.push({
                    mode: this.config?.presets?.[`${button}_mode`],
                    icon: this.config?.presets?.[`${button}_icon`]
                });
            });
        }

        let efficiency = 0;
        let unitState = "Heat Recovery";
        if (this.config.entities?.ventilation_unit_efficiency) {
            efficiency = this.getStateValue(this.config.entities?.ventilation_unit_efficiency);
        }
        const temps = this.config.temperatures;
        if (temps?.outdoor_air && temps?.extract_air) {
            const outdoorAir = this.getStateValue(temps.outdoor_air);
            const extractAir = this.getStateValue(temps.extract_air);
            if (efficiency == 0 && temps?.supply_air) {
                const supplyAir = this.getStateValue(temps.supply_air);
                const gain = supplyAir - outdoorAir;
                const potential = extractAir - outdoorAir;
                const rawEfficiency = potential !== 0 ? (gain / potential) * 100 : 0;
                efficiency = Math.max(0, Math.min(100, rawEfficiency));
            }
            if (outdoorAir > extractAir) {
                unitState = "Cooling Recovery";
            }
        }
        unitState = this.config.entities?.ventilation_unit_state ?
            this.hass.states[this.config.entities.ventilation_unit_state]?.state : unitState;

        return html `
            <ha-card>
                <div class="card-content">
                    <div class="dfvc-control-panel${(ventilationUnit || additionalEntity) ? " dfvc-control-panel-columns" : ""}">
                        <div class="dfvc-overview">
                            <div class="dfvc-temperatures">
                                <div class="dfvc-temperatures-left">
                                    ${this.renderTemperature(this.config.temperatures?.outdoor_air, "Outdoor Air")}
                                    ${this.renderTemperature(this.config.temperatures?.exhaust_air, "Exhaust Air")}
                                </div>
                                <div class="dfvc-temperatures-center">
                                    ${this.renderExchangerImage()}
                                </div>
                                <div class="dfvc-temperatures-right">
                                    ${this.renderTemperature(this.config.temperatures?.extract_air, "Extract Air")}
                                    ${this.renderTemperature(this.config.temperatures?.supply_air, "Supply Air")}
                                </div>
                            </div>
                            <div class="dfvc-cells-state">
                                <ha-icon icon="${this.getUnitStateIcon(unitState)}"></ha-icon>
                                ${this.renderEntityInfo(this.config.entities?.ventilation_unit_state, unitState)} (Efficiency
                                ${this.renderEntityInfo(this.config.entities?.ventilation_unit_efficiency, efficiency.toFixed(1) + " %")})
                           </div>
                        </div>
                        <div class="dfvc-entities">
                        ${entities.map(i => html `
                            <div class="dfvc-entity" @click="${() => this.showEntityInfo(i.entity)}">
                                <div class="dfvc-icon"><ha-icon icon="${this.getEntityIcon(i.entity)}"></ha-icon></div>
                                <div class="dfvc-value">${i.value}</div>
                            </div>
                        `)}
                        </div>
                    </div>
                    <div class="dfvc-presets">
                    ${presets.map(i =>  html `
                        <button class="${this.getEntityAttribute(this.config?.entities?.ventilation_unit, 'preset_mode') == i.mode ? 'selected' : ''}"
                                @click="${() => this.setPresetMode(i.mode)}">
                            <ha-icon icon="${i.icon}"></ha-icon>${i.mode}
                        </button>
                    `)}
                    </div>
                </div>
            </ha-card>
        `;
    }

    static get styles() {
        return css`
            .dfvc-control-panel {
                display: grid;
                border-radius: 12px;
                border: medium none;
                background-color: rgba(var(--rgb-primary-text-color), 0.05);
                margin-bottom: 12px;
                padding: 12px
            }
            .dfvc-control-panel-columns {
                grid-template-columns: auto 30%;
            }
            .dfvc-temperatures {
                display: grid;
                grid-template-columns: auto 50px auto;
                align-items: center;
                justify-items: center;
            }
            .dfvc-temperatures > .dfvc-temperatures-left {
                text-align: right;
            }
            .dfvc-temperatures > .dfvc-temperatures-right {
                text-align: left;
            }
            .dfvc-temperatures > .dfvc-temperatures-center {
                width: 50px;
                height: 50px;
            }
            .dfvc-cells-state {
                text-align: center;
            }
            .dfvc-cells-state > span {
                cursor: pointer;
            }
            .dfvc-temperatures-left > div, .dfvc-temperatures-right > div {
                padding: 10px;
            }
            .dfvc-temp-label {
                color: var(--secondary-text-color);
            }
            .dfvc-temp-value {
                font-size: 150%;
                cursor: pointer;
            }
            .dfvc-entity {
                margin-bottom: 10px;
                text-align: center;
            }
            .dfvc-entity .dfvc-icon {
                color: var(--secondary-text-color);
                margin-bottom: 5px;
            }
            .dfvc-entity .dfvc-value {
                font-size: 150%;
                cursor: pointer;
            }
            .dfvc-entities {
                border-left: 1px solid #555;
                padding-left: 20px;
                align-self: center;
            }
            .dfvc-presets {
                display: flex;
            }
            .dfvc-presets > button {
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 42px; /* Mushroom like */
                border-radius: 12px; /* Mushroom like */
                border: medium none;
                background-color: rgba(var(--rgb-primary-text-color), 0.05);
                color: var(--primary-text-color);
                transition: background-color 280ms ease-in-out 0s;
                font-size: var(--control-height);
                margin: 0px;
                padding: 0px;
                box-sizing: border-box;
                line-height: 0;
            }
            .dfvc-presets > button.selected {
                color: #555;
                background: #eee;
              }
            .dfvc-presets > button > ha-icon {
                margin-right: 12px;
            }
            .dfvc-presets > button:not(:last-child)
            {
              margin-right: 12px;
            }
        `;
    }
}

// Register the card with Home Assistant
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "dual-flow-ventilation-card",
    name: "Dual Flow Ventilation Card",
    description: "Simple card to display information related to a Dual Flow ventilation system",
    documentationURL: "https://github.com/wolandmaster/ha-dualflowventilation-card"
});

// vim: set ts=4 sw=4 et:
