
export function renderConfig(info, field, maxLen,record) {
  return {
    rules: [
      {
        required: true,
        message: maxLen ? `${info}必填且长度不超过${maxLen}个字` : `${info}必填`,
        max: maxLen ? maxLen : undefined,
        whitespace: true
      }],
    initialValue: record ? record[field] : ''
  }
}
