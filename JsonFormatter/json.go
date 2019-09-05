package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

type finale struct {
	label string
	value string
}
type stazione struct {
	Name       string  `json:"name"`
	ID         string  `json:"id"`
	Region     string  `json:"region"`
	RegionCode int     `json:"region_code"`
	City       string  `json:"city"`
	Lat        float32 `json:"lat"`
	Lon        float32 `json:"lon"`
}

func main() {
	jsonfile, err := os.Open("stazioni.json")
	if err != nil {
		fmt.Println(err)
	}
	defer jsonfile.Close()
	byteValue, _ := ioutil.ReadAll(jsonfile)
	var stazioni []stazione
	json.Unmarshal(byteValue, &stazioni)
	//fmt.Println(stazioni)

	f, err := os.Create("json.json")
	if err != nil {
		fmt.Println(err)
	}
	w := bufio.NewWriter(f)
	defer f.Close()
	fmt.Fprint(w, "[")
	for _, d := range stazioni {
		_, err = fmt.Fprintf(w, "{\"label\":\"%s\", \"value\":\"%s\"},", d.Name, d.ID)
		if err != nil {
			fmt.Println(err)
		}
	}
	fmt.Fprintf(w, "]")
	w.Flush()
}
