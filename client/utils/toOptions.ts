function toOptions<T>(states: Array<T>, value: keyof T, label: keyof T) {
    return states.map((state) => {
        return {
            value: state[value]!,
            label: state[label]!,
        };
    });
}

export default toOptions;
