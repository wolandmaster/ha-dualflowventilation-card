export interface DualFlowVentilationCardConfig {
    temperatures?: TemperaturesConfig;
    entities?: EntitiesConfig;
    presets?: PresetsConfig;
};

export interface TemperaturesConfig {
    extract_air?: any;
    outdoor_air?: any;
    supply_air?: any;
    exhaust_air?: any;
};

export interface EntitiesConfig {
    ventilation_unit?: any;
    additional_entity?: any;
    ventilation_unit_state?: any;
    ventilation_unit_efficiency?: any;
};

export interface PresetsConfig {
    left_mode?: string;
    left_icon?: string;
    middle_mode?: string;
    middle_icon?: string;
    right_mode?: string;
    right_icon?: string;
};

// vim: set ts=4 sw=4 et:
