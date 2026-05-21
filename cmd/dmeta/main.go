package main

import (
	"fmt"
	"os"

	dmetacmds "github.com/go-go-golems/dmeta/pkg/dmeta/cmds"
	"github.com/go-go-golems/glazed/pkg/cli"
	glazedcmds "github.com/go-go-golems/glazed/pkg/cmds"
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
	addGlazedCommand(rootCmd, "validate-ir", validateIR)

	generateCore, err := dmetacmds.NewGenerateCoreCommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating generate-core command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "generate-core", generateCore)

	planInstance, err := dmetacmds.NewPlanInstanceCommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating plan-instance command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "plan-instance", planInstance)

	scaffoldInstance, err := dmetacmds.NewScaffoldInstanceCommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating scaffold-instance command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "scaffold-instance", scaffoldInstance)

	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

func addGlazedCommand(rootCmd *cobra.Command, name string, command glazedcmds.Command) {
	cobraCmd, err := cli.BuildCobraCommandFromCommand(command,
		cli.WithParserConfig(cli.CobraParserConfig{
			ShortHelpSections: []string{schema.DefaultSlug},
			MiddlewaresFunc:   cli.CobraCommandDefaultMiddlewares,
		}),
	)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error building %s command: %v\n", name, err)
		os.Exit(1)
	}
	rootCmd.AddCommand(cobraCmd)
}
