export const formatStringToUrl = (name) => {
    let formatName = name.replace(/ /g, '_').toLowerCase();
    formatName = formatName.replace(/[^a-z0-9_]/g, '')
    return formatName;
}

export const formatUrlToString = (url) => {
    let formatUrl = url.replace(/_/g, ' ');
    formatUrl = formatUrl.replace(/(\b\w)/g, char => char.toUpperCase());
    return formatUrl;
}