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

	validateInteractions, err := dmetacmds.NewValidateInteractionsCommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating validate-interactions command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "validate-interactions", validateInteractions)

	elaborateInteractions, err := dmetacmds.NewElaborateInteractionsCommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating elaborate-interactions command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "elaborate-interactions", elaborateInteractions)

	lowerWeb, err := dmetacmds.NewLowerWebCommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating lower-web command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "lower-web", lowerWeb)

	validatePBUI, err := dmetacmds.NewValidatePBUICommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating validate-pbui command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "validate-pbui", validatePBUI)

	validatePBUIProfile, err := dmetacmds.NewValidatePBUIProfileCommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating validate-pbui-profile command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "validate-pbui-profile", validatePBUIProfile)

	lowerPBUI, err := dmetacmds.NewLowerPBUICommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating lower-pbui command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "lower-pbui", lowerPBUI)

	instantiatePBUI, err := dmetacmds.NewInstantiatePBUICommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating instantiate-pbui command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "instantiate-pbui", instantiatePBUI)

	planPBUIReact, err := dmetacmds.NewPlanPBUIReactCommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating plan-pbui-react command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "plan-pbui-react", planPBUIReact)

	planPBUIReactApp, err := dmetacmds.NewPlanPBUIReactAppCommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating plan-pbui-react-app command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "plan-pbui-react-app", planPBUIReactApp)

	scaffoldPBUIReact, err := dmetacmds.NewScaffoldPBUIReactCommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating scaffold-pbui-react command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "scaffold-pbui-react", scaffoldPBUIReact)

	scaffoldPBUIReactApp, err := dmetacmds.NewScaffoldPBUIReactAppCommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating scaffold-pbui-react-app command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "scaffold-pbui-react-app", scaffoldPBUIReactApp)

	planInstance, err := dmetacmds.NewPlanInstanceCommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating plan-instance command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "plan-instance", planInstance)

	planScaffold, err := dmetacmds.NewPlanScaffoldCommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating plan-scaffold command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "plan-scaffold", planScaffold)

	scaffoldReact, err := dmetacmds.NewScaffoldReactCommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating scaffold-react command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "scaffold-react", scaffoldReact)

	lowerReact, err := dmetacmds.NewLowerReactCommand()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error creating lower-react command: %v\n", err)
		os.Exit(1)
	}
	addGlazedCommand(rootCmd, "lower-react", lowerReact)

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
