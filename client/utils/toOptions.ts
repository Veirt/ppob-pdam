function toOptions<T>(
    states: Array<T>,
    value: keyof T,
    label: keyof T,
    def?: { label: any; value: any }
) {
    const options = states.map((state) => ({
        value: state[value] as any,
        label: state[label] as any,
    }));

    if (def) options.unshift(def);

    return options;
}

export default toOptions;
