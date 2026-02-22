export const applyMask = (value: string, type: 'cpf' | 'cnpj' | 'cpf_cnpj' | 'phone') => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');

    // Dynamic Mask: If it's <= 11 digits, we assume it's a CPF being typed. If it surpasses 11, it's a CNPJ.
    if (type === 'cpf_cnpj') {
        if (digits.length <= 11) {
            type = 'cpf';
        } else {
            type = 'cnpj';
        }
    }

    if (type === 'cpf') {
        return digits
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    }

    if (type === 'cnpj') {
        return digits
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    }

    if (type === 'phone') {
        if (digits.length <= 10) {
            return digits
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4})(\d)/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        } else {
            return digits
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        }
    }

    return value;
};
