export function filterOption(inputValue, option) {
	const goodsData = JSON.parse(option.props.value)?.goods_id
	const goodsNameFirst = goodsData?.goods_name + " " + goodsData?.goods_code
	const goodsCodeFirst = goodsData?.goods_code + " " + goodsData?.goods_name
	const inputValueLowerCase = inputValue.toLowerCase()

	const inputWords = inputValueLowerCase.split(" ")

	const allWordsMatch = inputWords.every(
		(word) =>
			goodsNameFirst.toLowerCase().includes(word) ||
			goodsCodeFirst.toLowerCase().includes(word)
	)

	return allWordsMatch
}
// filter option for every select