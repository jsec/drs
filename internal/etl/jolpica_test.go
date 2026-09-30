package etl

import (
	"bytes"
	"strings"
	"testing"
)

func TestRewriteJolpicaSchemaLeavesCopyDataUntouched(t *testing.T) {
	input := strings.Join([]string{
		"CREATE TABLE public.formula_one_driver (",
		"    nationality text",
		");",
		"COPY public.formula_one_driver (id, nationality) FROM stdin;",
		"1\tCzech Republic.",
		`\.`,
		"CREATE INDEX idx ON public.formula_one_driver USING btree (id);",
		"",
	}, "\n")
	want := strings.Join([]string{
		"CREATE TABLE jolpica.formula_one_driver (",
		"    nationality text",
		");",
		"COPY jolpica.formula_one_driver (id, nationality) FROM stdin;",
		"1\tCzech Republic.",
		`\.`,
		"CREATE INDEX idx ON jolpica.formula_one_driver USING btree (id);",
		"",
	}, "\n")

	var got bytes.Buffer
	if err := rewriteJolpicaSchema(&got, strings.NewReader(input)); err != nil {
		t.Fatalf("rewriteJolpicaSchema() error = %v", err)
	}
	if got.String() != want {
		t.Errorf("rewriteJolpicaSchema() =\n%s\nwant\n%s", got.String(), want)
	}
}
