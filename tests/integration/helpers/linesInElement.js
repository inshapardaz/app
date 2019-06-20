export default function linesInElement (element)
{
	return element.innerText.split(/(\r?\n)+/).map(line => line.trim()).filter(line => line.length > 0);
}
