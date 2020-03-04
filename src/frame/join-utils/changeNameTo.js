
/**
 * changeNameTo takes a change name description array of two elements containing the old names and the new names
 * e.g oldName=newName 'a name change descriptor' where '=' is the seperator
 * return an array of 2 strings [oldName, newName]
 * @param  {string} name old name to new name descriptor, 'OLD=NEW'
 * @param  {string} sep  string that seperates the old name from the new
 * @return {[oldName, newName]}      and ar
 */
export default function changeNameTo(name, sep) {
	 let res = name.split(sep);
	 if( res.length === 1) res.push(name);
	 return res;
}

