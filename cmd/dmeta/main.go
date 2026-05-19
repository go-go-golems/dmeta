package main

import (
	"fmt"
	"os"

	dmetacmds "github.com/go-go-golems/dmeta/pkg/dmeta/cmds"
	"github.com/go-go-golems/glazed/pkg/cli"
	"github.com/go-go-golems/glazed/pkg/cmds/schema"
	"github.com/spf13/cobra"
)

func main() {
	rootCmd := &cobra.Command{
		Use:   "dmeta",
		Short: "DMETA design-system factory tooling",
	}

	validateIR, err := dmetacmds.NewValidateIRCommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating validate-ir command: %v\n", err)
		os.Exit(1)
	}

	cobraValidateIR, err := cli.BuildCobraCommandFromCommand(validateIR,
		cli.WithParserConfig(cli.CobraParserConfig{
			ShortHelpSections: []string{schema.DefaultSlug},
			MiddlewaresFunc:   cli.CobraCommandDefaultMiddlewares,
		}),
	)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error building validate-ir command: %v\n", err)
		os.Exit(1)
	}
	rootCmd.AddCommand(cobraValidateIR)

	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}
